(function () {
  // Find current script tag and read config options
  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var scriptOrigin = currentScript && currentScript.src ? new URL(currentScript.src).origin : 'http://localhost:3000';
  var apiUrl = currentScript.getAttribute('data-api-url') || (scriptOrigin + '/api/testimonials/approved');
  var containerId = currentScript.getAttribute('data-container') || 'testimonial-widget';
  var accentColor = currentScript.getAttribute('data-accent') || '#4f46e5';
  var layout = currentScript.getAttribute('data-layout') || 'grid'; // grid | list
  var limit = parseInt(currentScript.getAttribute('data-limit')) || 6;
  var theme = currentScript.getAttribute('data-theme') || 'light';

  // Locate or create container
  var container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    if (currentScript.parentNode) {
      currentScript.parentNode.insertBefore(container, currentScript.nextSibling);
    } else {
      document.body.appendChild(container);
    }
  }

  // Inject widget CSS styles
  var styleId = 'testimonial-widget-styles';
  if (!document.getElementById(styleId)) {
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .tw-container {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: ${theme === 'dark' ? '#f3f4f6' : '#1f2937'};
        background-color: ${theme === 'dark' ? '#111827' : 'transparent'};
        width: 100%;
        box-sizing: border-box;
      }
      .tw-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
      }
      .tw-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .tw-card {
        background-color: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
        border: 1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .tw-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
      }
      .tw-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }
      .tw-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 12px;
        background-color: ${accentColor};
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
        flex-shrink: 0;
      }
      .tw-info {
        display: flex;
        flex-direction: column;
      }
      .tw-name {
        font-weight: 600;
        font-size: 15px;
        color: ${theme === 'dark' ? '#ffffff' : '#111827'};
        line-height: 1.2;
      }
      .tw-company {
        font-size: 13px;
        color: ${theme === 'dark' ? '#9ca3af' : '#6b7280'};
      }
      .tw-stars {
        color: #f59e0b;
        font-size: 16px;
        letter-spacing: 2px;
        margin-bottom: 10px;
      }
      .tw-text {
        font-size: 14px;
        line-height: 1.5;
        color: ${theme === 'dark' ? '#d1d5db' : '#374151'};
        margin: 0 0 12px 0;
        font-style: italic;
      }
      .tw-footer {
        font-size: 11px;
        color: ${theme === 'dark' ? '#6b7280' : '#9ca3af'};
        text-align: right;
      }
      .tw-loading, .tw-empty, .tw-error {
        text-align: center;
        padding: 30px;
        background-color: ${theme === 'dark' ? '#1f2937' : '#f9fafb'};
        border-radius: 12px;
        border: 1px dashed ${theme === 'dark' ? '#374151' : '#d1d5db'};
      }
      .tw-spinner {
        display: inline-block;
        width: 24px;
        height: 24px;
        border: 3px solid rgba(0,0,0,0.1);
        border-radius: 50%;
        border-top-color: ${accentColor};
        animation: tw-spin 0.8s linear infinite;
      }
      @keyframes tw-spin {
        to { transform: rotate(360deg); }
      }
      .tw-btn {
        display: inline-block;
        margin-top: 10px;
        padding: 8px 16px;
        background-color: ${accentColor};
        color: #ffffff;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      .tw-btn:hover {
        opacity: 0.9;
      }
      .tw-loadmore-container {
        text-align: center;
        margin-top: 24px;
      }
    `;
    document.head.appendChild(style);
  }

  var currentPage = 1;
  var allTestimonials = [];
  var hasMore = false;

  function renderStars(rating) {
    var stars = '';
    for (var i = 1; i <= 5; i++) {
      stars += i <= rating ? '★' : '☆';
    }
    return stars;
  }

  function getInitials(name) {
    if (!name) return 'U';
    var parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }

  function renderWidget(isLoading, isError, errorMessage) {
    if (isLoading && allTestimonials.length === 0) {
      container.innerHTML = `
        <div class="tw-container">
          <div class="tw-loading">
            <div class="tw-spinner"></div>
            <p style="margin-top: 10px; font-size: 14px; color: #6b7280;">Loading testimonials...</p>
          </div>
        </div>
      `;
      return;
    }

    if (isError && allTestimonials.length === 0) {
      container.innerHTML = `
        <div class="tw-container">
          <div class="tw-error">
            <p style="color: #ef4444; font-weight: 600; margin: 0 0 6px 0;">Unable to load testimonials</p>
            <p style="font-size: 13px; color: #6b7280; margin: 0;">${errorMessage || 'Something went wrong.'}</p>
            <button class="tw-btn" id="tw-retry-btn">Retry</button>
          </div>
        </div>
      `;
      var retryBtn = document.getElementById('tw-retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', function() { fetchPage(1, true); });
      }
      return;
    }

    if (!isLoading && !isError && allTestimonials.length === 0) {
      container.innerHTML = `
        <div class="tw-container">
          <div class="tw-empty">
            <p style="font-weight: 500; margin: 0; color: #6b7280;">No testimonials found yet.</p>
          </div>
        </div>
      `;
      return;
    }

    // Render testimonial cards
    var cardsHtml = allTestimonials.map(function (item) {
      var photoHtml = item.photo
        ? `<img class="tw-avatar" src="${item.photo}" alt="${item.name}" />`
        : `<div class="tw-avatar">${getInitials(item.name)}</div>`;

      var dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '';

      return `
        <div class="tw-card">
          <div>
            <div class="tw-header">
              ${photoHtml}
              <div class="tw-info">
                <span class="tw-name">${item.name}</span>
                <span class="tw-company">${item.company}</span>
              </div>
            </div>
            <div class="tw-stars">${renderStars(item.rating)}</div>
            <p class="tw-text">"${item.testimonial}"</p>
          </div>
          ${dateStr ? `<div class="tw-footer">${dateStr}</div>` : ''}
        </div>
      `;
    }).join('');

    var loadMoreBtnHtml = hasMore ? `
      <div class="tw-loadmore-container">
        <button class="tw-btn" id="tw-loadmore-btn" ${isLoading ? 'disabled' : ''}>
          ${isLoading ? 'Loading...' : 'Load More Testimonials'}
        </button>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="tw-container">
        <div class="${layout === 'list' ? 'tw-list' : 'tw-grid'}">
          ${cardsHtml}
        </div>
        ${loadMoreBtnHtml}
      </div>
    `;

    if (hasMore) {
      var loadMoreBtn = document.getElementById('tw-loadmore-btn');
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
          fetchPage(currentPage + 1, false);
        });
      }
    }
  }

  function fetchPage(page, reset) {
    if (reset) {
      currentPage = 1;
      allTestimonials = [];
    }
    renderWidget(true, false, null);

    var fetchUrl = apiUrl + (apiUrl.indexOf('?') >= 0 ? '&' : '?') + 'page=' + page + '&limit=' + limit;

    fetch(fetchUrl)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP error ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var items = Array.isArray(data) ? data : (data.testimonials || []);
        if (Array.isArray(data)) {
          hasMore = false;
        } else if (data.pagination) {
          hasMore = data.pagination.hasMore;
        } else {
          hasMore = false;
        }

        if (reset) {
          allTestimonials = items;
        } else {
          allTestimonials = allTestimonials.concat(items);
        }

        currentPage = page;
        renderWidget(false, false, null);
      })
      .catch(function (err) {
        renderWidget(false, true, err.message);
      });
  }

  // Initial fetch
  fetchPage(1, true);
})();
