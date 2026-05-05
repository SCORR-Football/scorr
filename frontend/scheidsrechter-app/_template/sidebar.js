/**
 * SCORR shared sidebar component
 * Wordt geïncludeerd in: home.html, index.html, selectie.html, trainingen.html
 *
 * Gebruik: in HTML één <script src="sidebar.js" defer></script> opnemen.
 * Het script injecteert zelf de ☰ knop, overlay en sidebar zodra DOM klaar is.
 *
 * De active-tab wordt afgeleid uit window.location.pathname.
 * Het ?club=... query param wordt automatisch doorgegeven aan alle links.
 */
(function () {
  'use strict';

  function getClubParam() {
    var p = new URLSearchParams(window.location.search);
    return p.get('club') || '';
  }

  function withClub(path) {
    var club = getClubParam();
    return club ? path + '?club=' + encodeURIComponent(club) : path;
  }

  function currentPage() {
    var path = window.location.pathname;
    if (path.endsWith('/home.html')) return 'home';
    if (path.endsWith('/selectie.html')) return 'selectie';
    if (path.endsWith('/trainingen.html')) return 'trainingen';
    if (path.endsWith('/uitleg.html')) return 'uitleg';
    if (path.endsWith('/stats.html')) return 'stats';
    if (path.endsWith('/index.html') || path.endsWith('/_template/')) return 'wedstrijden';
    return '';
  }

  function buildSidebar() {
    var active = currentPage();

    var navItems = [
      { id: 'home',        href: withClub('/frontend/scheidsrechter-app/_template/home.html'),        icon: '🏠', label: 'Home' },
      { id: 'wedstrijden', href: withClub('/frontend/scheidsrechter-app/_template/index.html'),       icon: '⚽', label: 'Wedstrijden' },
      { id: 'selectie',    href: withClub('/frontend/scheidsrechter-app/_template/selectie.html'),    icon: '👥', label: 'Selectie' },
      { id: 'stats',       href: withClub('/frontend/scheidsrechter-app/_template/stats.html'),       icon: '📊', label: 'Statistieken' },
      { id: 'trainingen',  href: withClub('/frontend/scheidsrechter-app/_template/trainingen.html'),  icon: '🏋️', label: 'Trainingen' },
      { id: 'uitleg',      href: withClub('/frontend/scheidsrechter-app/_template/uitleg.html'),      icon: '❓', label: 'Uitleg' }
    ];

    // CSS — ge-injecteerd in de pagina
    var css = '' +
      '#scorr-sidebar-toggle{position:fixed;top:10px;left:10px;z-index:10000;width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:rgba(30,39,73,0.9);border:1px solid rgba(0,255,136,0.25);border-radius:10px;color:#F0F4FF;font-size:18px;cursor:pointer;font-family:Lexend,sans-serif;padding:0;}' +
      '#scorr-sidebar-overlay{position:fixed;inset:0;background:rgba(10,14,39,0.6);z-index:10001;opacity:0;pointer-events:none;transition:opacity .2s ease;}' +
      '#scorr-sidebar-overlay.open{opacity:1;pointer-events:auto;}' +
      '#scorr-sidebar{position:fixed;top:0;left:0;bottom:0;width:260px;max-width:80vw;background:#0E1430;border-right:1px solid rgba(0,255,136,0.2);z-index:10002;transform:translateX(-100%);transition:transform .25s ease;font-family:Lexend,sans-serif;display:flex;flex-direction:column;}' +
      '#scorr-sidebar.open{transform:translateX(0);}' +
      '#scorr-sidebar-header{padding:20px 20px 14px 20px;border-bottom:1px solid rgba(255,255,255,0.06);}' +
      '#scorr-sidebar-header .scorr{font-size:22px;font-weight:900;color:#00FF88;letter-spacing:-1px;}' +
      '#scorr-sidebar-header .sub{font-size:10px;color:rgba(240,244,255,0.5);letter-spacing:2px;text-transform:uppercase;margin-top:2px;}' +
      '#scorr-sidebar-nav{flex:1;padding:14px 10px;overflow-y:auto;}' +
      '#scorr-sidebar-nav a{display:flex;align-items:center;gap:12px;padding:13px 14px;margin-bottom:2px;border-radius:10px;color:rgba(240,244,255,0.75);text-decoration:none;font-size:14px;font-weight:600;transition:background .15s ease,color .15s ease;}' +
      '#scorr-sidebar-nav a:hover{background:rgba(255,255,255,0.04);color:#F0F4FF;}' +
      '#scorr-sidebar-nav a.active{background:rgba(0,255,136,0.1);color:#00FF88;}' +
      '#scorr-sidebar-nav a .icon{font-size:18px;width:22px;text-align:center;}' +
      '#scorr-sidebar-footer{padding:14px;border-top:1px solid rgba(255,255,255,0.06);}' +
      '#scorr-sidebar-footer button{width:100%;background:transparent;border:1px solid rgba(255,59,92,0.4);color:#FF3B5C;border-radius:8px;padding:11px;font-size:13px;font-weight:700;font-family:Lexend,sans-serif;cursor:pointer;letter-spacing:1px;}';

    var styleEl = document.createElement('style');
    styleEl.id = 'scorr-sidebar-styles';
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // Toggle button (☰)
    var toggleBtn = document.createElement('button');
    toggleBtn.id = 'scorr-sidebar-toggle';
    toggleBtn.type = 'button';
    toggleBtn.setAttribute('aria-label', 'Menu openen');
    toggleBtn.textContent = '☰';

    // Overlay
    var overlay = document.createElement('div');
    overlay.id = 'scorr-sidebar-overlay';

    // Sidebar
    var sidebar = document.createElement('aside');
    sidebar.id = 'scorr-sidebar';

    var header = document.createElement('div');
    header.id = 'scorr-sidebar-header';
    header.innerHTML = '<div class="scorr">SCORR</div><div class="sub">Coach app</div>';

    var nav = document.createElement('nav');
    nav.id = 'scorr-sidebar-nav';
    navItems.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href;
      if (item.id === active) a.className = 'active';
      a.innerHTML = '<span class="icon">' + item.icon + '</span>' + item.label;
      nav.appendChild(a);
    });

    var footer = document.createElement('div');
    footer.id = 'scorr-sidebar-footer';
    var logoutBtn = document.createElement('button');
    logoutBtn.type = 'button';
    logoutBtn.id = 'scorr-sidebar-logout';
    logoutBtn.textContent = '🚪 Uitloggen';
    logoutBtn.addEventListener('click', function () {
      // Pagina-niveau auth heeft eigen signOut; dispatch event en laat host beslissen.
      // Default: ga naar login.
      var ev = new CustomEvent('scorr:sidebar-logout');
      window.dispatchEvent(ev);
      setTimeout(function () {
        if (!ev.defaultPrevented) {
          window.location.href = '/frontend/auth/login.html';
        }
      }, 50);
    });
    footer.appendChild(logoutBtn);

    sidebar.appendChild(header);
    sidebar.appendChild(nav);
    sidebar.appendChild(footer);

    // Open/close logica
    function open() {
      sidebar.classList.add('open');
      overlay.classList.add('open');
    }
    function close() {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    }
    toggleBtn.addEventListener('click', open);
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    document.body.appendChild(toggleBtn);
    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);

    // Public API
    window.scorrSidebar = {
      open: open,
      close: close,
      setSubtitle: function (text) {
        var sub = header.querySelector('.sub');
        if (sub) sub.textContent = text;
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildSidebar);
  } else {
    buildSidebar();
  }
})();
