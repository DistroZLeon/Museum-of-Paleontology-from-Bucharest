document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.Parte_cu_titlu');
const themeButton = container.querySelector('.theme-toggle');

const theme = localStorage.getItem('theme');

theme && document.body.classList.add(theme);

const handleTheme= () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark-mode');
  } else {
    localStorage.removeItem('theme');
  }
};

themeButton.addEventListener('click', handleTheme);

let createTimeout;
  let deleteTimeout;
  let interval;

  function createAd(){
    const reclama=document.createElement('div');
    reclama.textContent="<Don't forget to check the museum's encyclopedia!>";
    reclama.style.fontWeight="bolder";
    const parinte=document.getElementById('create&delete');
    parinte.appendChild(reclama);
  }

  function deleteAd(){
    const parent=document.getElementById('create&delete');
    const reclama=parent.firstChild;
    if(reclama){
      const parinte=reclama.parentNode;
      parinte.removeChild(reclama);
    }
  }

  function createAndDeleteAd(){
    if(createTimeout){
      clearTimeout(createTimeout);
    }
    if(deleteTimeout){
      clearTimeout(deleteTimeout);
    }

    const createInterval=Math.floor(Math.random()*5000)+1000;
    const deleteInterval=Math.floor(Math.random()*10000)+1000;

    createTimeout=setTimeout(createAd,createInterval);
    deleteTimeout=setTimeout(deleteAd,createInterval+deleteInterval);

  }

  createAndDeleteAd();
  interval=setInterval(createAndDeleteAd,16000);
  
  window.addEventListener('beforeunload',()=>{
    clearInterval(interval);
  });
});