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

  const total=document.getElementsByClassName('total')[0];
  const elder=document.getElementById('elders');
  const adult=document.getElementById('adults');
  const student=document.getElementById('students');
  const child=document.getElementById('children');
  const name=document.getElementById('name');
  const tel=document.getElementById('tel');
  const mail=document.getElementById('mail');
  const date=document.getElementById('date');
  const form=document.getElementById('purchase');

  function updateTotal(){
    const cantitate1=parseInt(elder.value)||0;
    const cantitate2=parseInt(adult.value)||0;
    const cantitate3=parseInt(student.value)||0;
    const cantitate4=parseInt(child.value)||0;
    const cantitateTotala=5*(cantitate1+cantitate3+cantitate4)+20*cantitate2;
    total.textContent=cantitateTotala;
    total.style.textDecoration='underline';
    total.style.fontWeight='bold';
    total.style.fontStyle='italic';
    if(cantitateTotala<50){
      total.style.color='darkgreen';
    }
    else if(cantitateTotala<100){
      total.style.color='orange';
    }
    else if(cantitateTotala<300){
      total.style.color='red';
    }
    else{
      total.style.color='darkred';
    }
  }

  elder.addEventListener('input',updateTotal);
  adult.addEventListener('input',updateTotal);
  student.addEventListener('input',updateTotal);
  child.addEventListener('input',updateTotal);

  function showDetails(event){
    event.preventDefault();

    const nume=name.value;
    const telefon=tel.value;
    const email=mail.value;
    const data=date.value;
    const cantitate1=parseInt(elder.value)||0;
    const cantitate2=parseInt(adult.value)||0;
    const cantitate3=parseInt(student.value)||0;
    const cantitate4=parseInt(child.value)||0;
    const cantitateTotala=5*(cantitate1+cantitate3+cantitate4)+20*cantitate2;

    const details=window.open('','PurchaseDetails','width=500,height=500,top=300,left=450');
    details.document.write('<html><head><title>Purchase Details</title></head><body>');
    details.document.write('<h1>Purchase Completed</h1>');
    details.document.write('<h2>Purchase Details</h2>');
    details.document.write('<p>Name of the client: ' + nume + '</p>');
    details.document.write('<p>Telephone number: ' + telefon + '</p>');
    details.document.write('<p>Email: ' + email + '</p>');
    details.document.write('<p>Date of the visit: ' + data + '</p>');
    details.document.write('<p>Number of tickets for children: ' + cantitate4 + '</p>');
    details.document.write('<p>Number of tickets for students: ' + cantitate3 + '</p>');
    details.document.write('<p>Number of tickets for adults: ' + cantitate2 + '</p>');
    details.document.write('<p>Number of tickets for elders: ' + cantitate1 + '</p>');
    details.document.write('<p>Total price: ' + cantitateTotala + ' RON</p>');
    details.document.write('</body></html>');
    details.document.close();

    const checkDetailsClosed= setInterval(()=>{
      if(details.closed){
        clearInterval(checkDetailsClosed);
        form.reset();
        updateTotal();
      }
    },500);
  }

  form.addEventListener('submit',showDetails);

  updateTotal();

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