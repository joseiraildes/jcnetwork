const imageInput = document.querySelector('[data-image-input]');
const imagePreview = document.querySelector('[data-image-preview]');

imageInput.addEventListener('change', (event) => {
    const [file] = imageInput.files
    imagePreview.src = file ? URL.createObjectURL(file) : '';
})