const parametrii=new URLSearchParams(window.location.search);
const id=parametrii.get('id');
var info;
const infoGet=async ()=>{ info=await fetch('http://localhost:3000/dinosaur/'+id).then(response=>{
    return response.json();
}).catch(error=>console.error('Error: ',error));};
window.onload=async ()=>{
    if(id){
            await infoGet();
        }
    const form=document.getElementById('formular');
    if(id){
        form.Name.value=info.Name;
        form.Habitat.value=info.Habitat;
        form.Order.value=info.Order;
        form.Hip_Clade.value=info.Hip_Clade;
        form.Diet.value=info.Diet;
    }
    form.addEventListener('submit',async (event)=>{
        event.preventDefault();
        formInfo=new FormData(form);
        formInfoFormatted=Object.fromEntries(formInfo);
        if(!id){
            await fetch('http://localhost:3000/dinosaur/',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(formInfoFormatted),
                withCredentials: true,
                credentials: "include"
            });
        }
        else{
            await fetch('http://localhost:3000/dinosaur/'+id,{
                method:'PATCH',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(formInfoFormatted),
                withCredentials: true,
                credentials: "include"
            });
            console.log(JSON.stringify(formInfoFormatted));
        }
        window.close();
    });
};