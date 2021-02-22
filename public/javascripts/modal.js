(function(w,d){

    document.addEventListener('click', function (e) {
        e = e || w.event;
        let target = e.target || e.srcElement;
        
        if (target.hasAttribute('data-toggle') && target.getAttribute('data-toggle') == 'modal') {
            if (target.hasAttribute('data-target')) {
                let m_ID = target.getAttribute('data-target');
                d.getElementById(m_ID).classList.add('open');
                e.preventDefault();
            }
        }
    
        // Close modal window with 'data-dismiss' attribute or when the backdrop is clicked
        if ((target.hasAttribute('data-dismiss') && target.getAttribute('data-dismiss') == 'modal') || target.classList.contains('modal')) {
            let modal = d.querySelector('[class="modal open"]');
            modal.classList.remove('open');
            e.preventDefault();
        }
    }, false);

    w.modal = d.querySelector("#main-modal");

})(window, document);