import qrcode
from PIL import Image

def make_true_heart_qr(url, output_file):
    # Setup QR Code
    border = 2
    box_size = 15
    version = 5
    
    qr = qrcode.QRCode(
        version=version, 
        error_correction=qrcode.constants.ERROR_CORRECT_H, # High error correction is required since we will cut off some data modules!
        box_size=box_size,
        border=border
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    matrix = qr.modules
    modules_count = len(matrix)
    
    # 1. Create the base QR code with Pink background and Black dots
    qr_img = qr.make_image(fill_color="black", back_color="#FF69B4").convert("RGB")
    w, h = qr_img.size
    
    # 2. Create the heart mask
    mask = Image.new("L", (w, h), 0)
    pixels = mask.load()
    
    for r in range(h):
        for c in range(w):
            # Mathematical heart equation mapping
            # Scale x to [-1.3, 1.3] and y to [1.25, -1.25]
            x = (c / w) * 2.6 - 1.3
            y = 1.3 - (r / h) * 2.6
            
            # Equation: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
            val = (x**2 + y**2 - 1)**3 - (x**2) * (y**3)
            
            # Find which QR module this pixel belongs to
            mod_c = c // box_size
            mod_r = r // box_size
            
            # Finder patterns (Top-Left, Top-Right, Bottom-Left)
            # They are 7x7 modules. We include a 1-module margin (so 8x8) to preserve the quiet zone.
            is_tl = (mod_c < border + 8) and (mod_r < border + 8)
            is_tr = (mod_c >= modules_count - border - 8) and (mod_r < border + 8)
            is_bl = (mod_c < border + 8) and (mod_r >= modules_count - border - 8)
            
            # Include pixel if it's inside the heart OR inside a finder pattern
            if val <= 0 or is_tl or is_tr or is_bl:
                pixels[c, r] = 255

    # 3. Paste the QR code onto a black background using the heart mask
    final = Image.new("RGB", (w, h), "black")
    final.paste(qr_img, (0,0), mask)
    final.save(output_file)
    print("True heart masked QR code generated successfully!")

make_true_heart_qr('https://nadzirin26.github.io/coba-bikin-surat/', 'qr_code_true_love.png')
