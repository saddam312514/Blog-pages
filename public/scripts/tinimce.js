window.onload = function() {

    tinymce.init({
        selector: '#description',
        plugins: ["advlist lists link autolink autosave code",
        'preview', 'searchreplace', 'wordcount', 'media table emoticons image imagetools'],
        toolbar: 'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | forecolor backcolor emoticons | code previw',
        height: 300,
        automatic_uploads: true,
        images_upload_url: '/uploads/postimage',
        relative_urls: false,
        image_upload_handler: function(blobInfo, success, failure) {
            let headers = new Headers()
            headers.append('Accept', 'Application/JSON')
            let formData = new FormData()
            formData.append('post-image', blobInfo.blob(), blobInfo.filename())
            let req = new Request('/uploads/postimage',{
                method: 'POST',
                headers,
                mode: 'cors',
                body: formData
            })
            fetch(req)
            .then(res => res.json())
            .then(data => success(data.imgUrl))
            .catch(() => failure('HTTP Error'))

        }
        
      
       
    })
}