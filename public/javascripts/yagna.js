(function(w,d){
    const pbtn = d.querySelector("#submitPen"),
          resbtn = d.querySelector("#resetPen"),
          getReady = function(){
            resbtn.removeAttribute('disabled');
            pbtn.removeAttribute("disabled");
            pbtn.classList.remove("yn-load-waiting");
          },
          forceStart = setTimeout(function(){
            // source.close();
            getReady();
          },15000);

    // listen for a Ready message to update the status
    // source.addEventListener('message', message => {
    //     if(message.data == "Ready"){
    //         console.log(`Yagna ready`);
    //         source.close();
    //         clearTimeout(forceStart);
    //         getReady();
    //     } else {
    //         console.log(message.data);
    //     }
    // });
    
})(window,document)