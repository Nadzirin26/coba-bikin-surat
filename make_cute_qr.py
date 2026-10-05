import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
from PIL import Image

# Setup QR Code
qr = qrcode.QRCode(
    version=5, # Higher version for better error correction when embedding an image
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=12,
    border=4,
)
qr.add_data('https://nadzirin26.github.io/coba-bikin-surat/')
qr.make(fit=True)

# Generate Cute QR Code with rounded dots and soft pink colors
# Embedding the classy cat girl image in the center
try:
    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        color_mask=SolidFillColorMask(front_color=(205, 92, 92), back_color=(255, 240, 245)), # Indian Red on Lavender Blush
        embeded_image_path="cat_girl_2.jpg"
    )
    img.save('qr_code_cute.png')
    print("Cute QR Code with image generated!")
except Exception as e:
    # Fallback if embedding fails
    print(f"Embedding failed: {e}. Generating without image.")
    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        color_mask=SolidFillColorMask(front_color=(255, 105, 180), back_color=(255, 255, 255))
    )
    img.save('qr_code_cute.png')
