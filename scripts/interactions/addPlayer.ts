export const AddPlayer = async(opt: any)=>{
    const idsString = opt?.options[0]?.value as string ?? "";
    const ids = idsString.split(";") ?? [];

    await fetch("https://wgr.vercel.app/api/sendid?ids=" + JSON.stringify(ids));
    return {
        type:4,
        data:{
            content: 'ID(s) added'
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