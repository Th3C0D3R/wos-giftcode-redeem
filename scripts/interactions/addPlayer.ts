export const AddPlayer = async(opt)=>{
    console.log(opt?.options);
    return {
        type:4,
        data:{
            content: 'Hello'
        }
    }
    /* fetch("https://wgr.vercel.app/api/sendid?id=" + id).then(res => {
                res.json().then( x => {
                    if(x["status"] && x["status"] === 500){
                        spanSuccess.style["visibility"] = "hidden";
                        spanFail.style["visibility"] = "visible";
                        spanFail.value = x["data"];
                        btn.removeAttribute("disabled");
                    }
                    else if(x["status"] && x["status"] === 200){
                        spanFail.style["visibility"] = "hidden";
                        spanSuccess.style["visibility"] = "visible";
                        spanSuccess.value = x["data"];
                        btn.removeAttribute("disabled");
                    }
                    else{
                        spanSuccess.style["visibility"] = "hidden";
                        spanFail.style["visibility"] = "visible";
                        spanFail.value = x["data"];
                        btn.removeAttribute("disabled");
                    }
                });
            }); */
}