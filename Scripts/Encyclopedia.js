

document.addEventListener('DOMContentLoaded', function() {
// Light mode/ Dark mode
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

//MongoDB
const creare=document.getElementById('creare');
creare.addEventListener('click',()=>{
  const fereastra=window.open('Creare.html');
  const instanta=setInterval(()=>{
    if(fereastra&&fereastra.closed){
      clearInterval(instanta);
      location.reload();
    }
  },1000);
})
if(!localStorage.getItem('log')){
  const parent=document.getElementById('ceva');
  parent.removeChild(creare);
}
async function getData(){
    await fetch('http://localhost:3000/dinosaur/').then(response=>{
    if(!response.ok){
      throw new Error('The response from the network was not okay!')
    } 
    return response.json();
  }).then(data=>{
    const loc=document.getElementById('Dinobauri');
    for(i in data){
      let copie=data[i];
      let id;
      const container=document.createElement('div');
      container.className='Details';
      for(j in data[i]){
        if(j==='_id'){ id=data[i][j];}
        else if(j==='Time'||j==='Contemporary'||j==='Areas_where_fossils_were_found'){
          continue;
        }
        else{
          const info=document.createElement('h4');
          info.innerText=`${data[i][j]}`;
          container.appendChild(info);
        }
      }
      if(localStorage.getItem('log')){
        const edit=document.createElement('button');
        const deletation=document.createElement('button');
        edit.innerText='Edit';
        deletation.innerText='Delete';
        container.appendChild(edit);
        container.appendChild(deletation);

        edit.addEventListener('click',()=>{
          const fereastra=window.open('Creare.html?id='+id,rel=opener);
          const instanta=setInterval(()=>{
            if(fereastra&&fereastra.closed){
              clearInterval(instanta);
              location.reload();
            }
          },1000);
        });

        deletation.addEventListener('click',async (event)=>{
          event.preventDefault();
          await fetch(`http://localhost:3000/dinosaur/${id}`,{
            method:'DELETE',
            withCredentials: true,
            credentials: "include"
          });
          location.reload();
        });
      }
      loc.appendChild(container);
    }
  }).catch(error=>console.error('Error: ',error));
}
getData();
//Login/Register
const login=document.getElementById('login');
const register=document.getElementById('register');

login.addEventListener('click',openLogReg);
register.addEventListener('click',openLogReg);

function openLogReg(event){
  event.preventDefault();

  const width = 500;
  const height = 400;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  const options = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

  const fereastra=window.open(event.target.href,'_blank',options);
  const checkFereastra=setInterval(()=>{
    if(fereastra &&fereastra.closed){
      clearInterval(checkFereastra);
      location.reload();
    }
  },300);
}

function verificareLocalStorage(){
  const login=document.getElementById('login');
  const register=document.getElementById('register');
  const stareLog=localStorage.getItem('log');
  if(stareLog && login && register){
    const optiuni=document.getElementById('optiuni');
    optiuni.removeChild(login);
    optiuni.removeChild(register);
    const logout=document.createElement('button');
    logout.textContent='Log out';
    logout.id='logout';
    optiuni.appendChild(logout);
  }
  const logout=document.getElementById('logout');
  if(logout){
    logout.addEventListener('click',async ()=>{
      await fetch('http://localhost:3000/logout',{
            method:'POST',
            withCredentials: true,
            credentials: "include"
          });
      localStorage.removeItem('log');
      location.reload();
    });
  }
}
verificareLocalStorage();
});
