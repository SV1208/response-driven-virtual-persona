let videos = [];

let idx = 0; // index of center video

const leftVideo = document.getElementById('leftVideo');
const centerVideo = document.getElementById('centerVideo');
const rightVideo = document.getElementById('rightVideo');
const demoTitle = document.getElementById('demoTitle');
const demoDescription = document.getElementById('demoDescription');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function mod(n, m){ return ((n % m) + m) % m; }

function render(){
  if(videos.length === 0) return; // safety check
  
  const leftIdx = mod(idx - 1, videos.length);
  const rightIdx = mod(idx + 1, videos.length);

  leftVideo.src = videos[leftIdx].src;
  leftVideo.load();
  leftVideo.pause();

  centerVideo.src = videos[idx].src;
  centerVideo.load();
  centerVideo.currentTime = 0;
  centerVideo.play().catch(()=>{});

  if(demoTitle){
    demoTitle.textContent = videos[idx].title || '';
  }
  if(demoDescription){
    demoDescription.textContent = videos[idx].description || '';
  }

  rightVideo.src = videos[rightIdx].src;
  rightVideo.load();
  rightVideo.pause();
}

// Load videos from configuration file
async function loadVideos(){
  try {
    const response = await fetch('videos.json');
    const data = await response.json();
    videos = data.videos;
    render(); // render once videos are loaded
  } catch(err) {
    console.error('Error loading videos.json:', err);
  }
}

prevBtn.addEventListener('click', ()=>{ idx = mod(idx - 1, videos.length); render(); });
nextBtn.addEventListener('click', ()=>{ idx = mod(idx + 1, videos.length); render(); });

// keyboard navigation
window.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowLeft'){ prevBtn.click(); }
  if(e.key === 'ArrowRight'){ nextBtn.click(); }
});

// initialize when DOM ready - use DOMContentLoaded for earlier execution
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', ()=>{ loadVideos(); });
} else {
  loadVideos();
}

// clicking side slots brings them to center
document.getElementById('leftVideo').addEventListener('click', ()=>{ idx = mod(idx - 1, videos.length); render(); });
document.getElementById('rightVideo').addEventListener('click', ()=>{ idx = mod(idx + 1, videos.length); render(); });

// optional: pause center when not visible (helpful if user navigates away)
document.addEventListener('visibilitychange', ()=>{
  if(document.hidden){ centerVideo.pause(); }
  else { /* no-op */ }
});

// Toggle dark mode (simple)
function toggleDarkMode(){
  document.documentElement.classList.toggle('dark');
  syncDarkModeButton();
}

function syncDarkModeButton(){
  const btn = document.querySelector('.toggle-btn');
  if(!btn) return;
  if(document.documentElement.classList.contains('dark')) btn.textContent = 'Light Mode';
  else btn.textContent = 'Dark Mode';
}

syncDarkModeButton();

// Scroll to top
function scrollToTop(){
  window.scrollTo({top:0,behavior:'smooth'});
}
