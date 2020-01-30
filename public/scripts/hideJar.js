const seconds = 1000;

const hide = function() {
  const jar = document.getElementById('jar');
  jar.style.visibility = 'hidden';
  setTimeout(() => {
    jar.style.visibility = 'visible';
  }, seconds);
};

module.exports = { hide };
