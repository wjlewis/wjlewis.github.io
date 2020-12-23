const $readme = document.querySelector('#readme');
const $cv = document.querySelector('#cv');
const $about = document.querySelector('#about');

const $readmeToggle = document.querySelector('#readme-toggle');
const $cvToggle = document.querySelector('#cv-toggle');
const $aboutToggle = document.querySelector('#about-toggle');

const STATES = {
  README: 'README',
  CV: 'CV',
  ABOUT: 'ABOUT',
};

$readmeToggle.addEventListener('click', () => {
  switchTo(STATES.README);
});

$cvToggle.addEventListener('click', () => {
  switchTo(STATES.CV);
});

$aboutToggle.addEventListener('click', () => {
  switchTo(STATES.ABOUT);
});

async function switchTo(state) {
  switch (state) {
    case STATES.README:
      show($readme);
      hide($cv, $about);
      setActive($readmeToggle);
      setInactive($cvToggle, $aboutToggle);
      return;
    case STATES.CV:
      show($cv);
      hide($readme, $about);
      setActive($cvToggle);
      setInactive($readmeToggle, $aboutToggle);
      return;
    case STATES.ABOUT:
      show($about);
      hide($readme, $cv);
      setActive($aboutToggle);
      setInactive($readmeToggle, $cvToggle);
      return;
    default:
      console.error(`Unrecognized state: ${state}.`);
  }
}

function show(...elts) {
  elts.forEach(elt => {
    elt.style.display = 'unset';
  });
}

function hide(...elts) {
  for (let elt of elts) {
    elt.style.display = 'none';
  }
}

function setInactive(...elts) {
  elts.forEach(elt => {
    elt.classList.remove('active');
  });
}

function setActive(elt) {
  elt.classList.add('active');
}

function initState() {
  switch (location.hash) {
    case '#readme':
    case '':
      return STATES.README;
    case '#cv':
      return STATES.CV;
    case '#about':
      return STATES.ABOUT;
    default:
      console.error(
        `Unrecognized hash: "${location.hash}".\nFalling back to README.`
      );
      return STATES.README;
  }
}

switchTo(initState());
