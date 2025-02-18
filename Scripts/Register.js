const register=document.getElementById('register');
register.addEventListener('submit',(event)=>{
    event.preventDefault();

    const name=document.getElementById('name').value;
    const username=document.getElementById('username').value;
    const password=document.getElementById('password').value;
    const mail=document.getElementById('mail').value;
    const tel=document.getElementById('tel').value;
    const credit=document.getElementById('credit').value;
    const json=JSON.stringify({name,username,password,mail,tel,credit});
    fetch('http://localhost:3000/register',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:json
    }).then(response=>response.text()).then(message=> {document.getElementById('registerMessage').innerText=message;}).catch(error=>console.error('Error: ',error));
});