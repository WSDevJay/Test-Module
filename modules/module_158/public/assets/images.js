const _form = document.querySelector('[data-s3-uppy="form"]');
const imageField = document.querySelector('#image');
const submitBtn = document.querySelector('#submitBtn');

const uppy = Uppy.Core({
  autoProceed: true,
  restrictions: {
    maxFileSize: 2097152, // Limit size to 2 MB on the javascript side
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/webp']
  }
})
  .use(Uppy.Dashboard, {
    inline: true,
    target: '#drag-drop-area',
    note: 'Images only, up 2MB',
    width: '100%',
    height: 350
  })
  .use(Uppy.DragDrop)
  .use(Uppy.GoldenRetriever)
  .use(Uppy.AwsS3, {
    getUploadParameters() {
      submitBtn.disabled = true;
      // 1. Get URL to post to from action attribute
      const _url = _form.getAttribute('action');
      // 2. Create Array from FormData object to make it easy to operate on
      const _formDataArray = Array.from(new FormData(_form));
      // 3. Create a JSON object from array
      const _fields = _formDataArray.reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {});

      // 4. Return resolved promise with Uppy. Uppy it will add file in file param as the last param
      return Promise.resolve({
        method: 'POST',
        url: _url,
        fields: _fields
      });
    }
  });

uppy.on('upload-success', (_file, data) => {
  if(!imageField.value){
    imageField.value = data.body.location;
  }else if(!imageField2.value){
    imageField2.value = data.body.location;
  }else if(!imageField3.value){
    imageField3.value = data.body.location;
  }
});

uppy.on('complete', ({ failed, successful }) => {
  submitBtn.disabled = false;
});