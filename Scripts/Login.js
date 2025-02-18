const login=document.getElementById('login');
login.addEventListener('submit',async (event)=>{
    event.preventDefault();

    const username=document.getElementById('username').value;
    const password=document.getElementById('password').value;

    await fetch('http://localhost:3000/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({username,password})
    }).then(response=>{if(response.ok){localStorage.setItem('log','in')} ;return response.text()}).then(message=> {
        document.getElementById('loginMessage').innerText=message;
    }).catch(error=>console.error('Error: ',error));
    window.close();
});