const widthInput = document.getElementById('widthInput');
        const heightInput = document.getElementById('heightInput');
        const folderInput = document.getElementById('folderInput');
        const fileInput = document.getElementById('fileInput');
        const imageList = document.getElementById('imageList');
        const downloadZipBtn = document.getElementById('downloadZipBtn');
        let zip = new JSZip();
        let processedCount = 0;

        // Reusable Function
        function handleFiles(files) {
            const width = parseInt(widthInput.value);
            const height = parseInt(heightInput.value);

            if (!width || !height) {
                alert("Please enter valid Width and Height before uploading.");
                return;
            }

            imageList.innerHTML = '';
            zip = new JSZip();
            processedCount = 0;
            downloadZipBtn.style.display = "none";

            if (!files.length) return;

            for (const file of files) {
                const img = new Image();
                img.src = URL.createObjectURL(file);

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = "#ffffff"; // background
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(blob => {
                        zip.file(file.name, blob);

                        const info = document.createElement('div');
                        info.textContent = `${file.name} → Resized to ${width} x ${height}`;
                        imageList.appendChild(info);

                        processedCount++;
                        if (processedCount === files.length) {
                            downloadZipBtn.style.display = "inline-block";
                        }
                    }, 'image/png');
                };
            }
        }

        folderInput.addEventListener('change', (e) => handleFiles(Array.from(e.target.files)));
        fileInput.addEventListener('change', (e) => handleFiles(Array.from(e.target.files)));

        downloadZipBtn.addEventListener('click', () => {
            zip.generateAsync({ type: "blob" }).then((content) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = "resized_images.zip";
                link.click();
            });
        });