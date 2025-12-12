// Smooth scroll for in-page links
const internalLinks = document.querySelectorAll('a[href^="#"]');
internalLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Reveal on scroll
const animatedItems = document.querySelectorAll('[data-animate]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedItems.forEach((item) => observer.observe(item));
} else {
  animatedItems.forEach((item) => item.classList.add('is-visible'));
}

// Form handling with optional Formspree endpoint
const form = document.querySelector('.contact-form');
if (form) {
  const endpoint = form.dataset.endpoint || '';
  const statusEl = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');

  const setStatus = (message, type = '') => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('success', 'error');
    if (type) statusEl.classList.add(type);
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('');

    const formData = new FormData(form);
    const hasRealEndpoint = endpoint && !endpoint.includes('your-form-id');

    if (hasRealEndpoint) {
      button.disabled = true;
      button.textContent = 'Sending...';
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });
        if (response.ok) {
          setStatus('Thanks! Your message was sent.', 'success');
          form.reset();
        } else {
          setStatus('Sending failed. Please try again or email me directly.', 'error');
        }
      } catch (error) {
        setStatus('Network error. Try again in a moment.', 'error');
      } finally {
        button.disabled = false;
        button.textContent = 'Send Message';
      }
    } else {
      button.textContent = 'Message sent (demo)';
      setTimeout(() => {
        button.textContent = 'Send Message';
      }, 2200);
      setStatus('Demo only — replace the Formspree ID to activate.', 'success');
      form.reset();
    }
  });
}
