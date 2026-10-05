import qrcode
from PIL import Image, ImageDraw

def create_heart_qr(url, filename):
    # Setup QR code
    qr = qrcode.QRCode(
        version=5,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=30,  # High resolution
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    matrix = qr.modules
    box_size = qr.box_size
    img_size = len(matrix) * box_size
    
    # Create soft pink background
    img = Image.new('RGB', (img_size, img_size), (255, 240, 245)) # Lavender Blush
    draw = ImageDraw.Draw(img)
    
    # QR code color
    heart_color = (220, 20, 60) # Crimson Red / Hot Pink
    
    # Helper to check if a module is part of the 3 main finder patterns
    # Finder patterns are 7x7 blocks in the corners
    def is_finder(r, c, size):
        # Top-Left
        if r < 7 and c < 7: return True
        # Top-Right
        if r < 7 and c >= size - 7: return True
        # Bottom-Left
        if r >= size - 7 and c < 7: return True
        return False

    for r in range(len(matrix)):
        for c in range(len(matrix[0])):
            if matrix[r][c]:
                x0 = c * box_size
                y0 = r * box_size
                x1 = x0 + box_size
                y1 = y0 + box_size
                
                if is_finder(r, c, len(matrix)):
                    # Draw normal squares for finder patterns to keep it readable
                    draw.rectangle([x0, y0, x1, y1], fill=heart_color)
                else:
                    # Draw a tiny heart for the data dots!
                    pad = box_size * 0.15
                    px0 = x0 + pad
                    py0 = y0 + pad
                    px1 = x1 - pad
                    py1 = y1 - pad
                    
                    w = px1 - px0
                    h = py1 - py0
                    
                    # Left circle
                    draw.ellipse([px0, py0, px0 + w/2, py0 + h/2], fill=heart_color)
                    # Right circle
                    draw.ellipse([px0 + w/2, py0, px1, py0 + h/2], fill=heart_color)
                    # Bottom triangle
                    draw.polygon([
                        (px0 + 0.5, py0 + h/4), 
                        (px1 - 0.5, py0 + h/4), 
                        (px0 + w/2, py1)
                    ], fill=heart_color)

    # Optional: We can still embed the girl cat image in the center!
    try:
        logo = Image.open("cat_girl_1.jpg")
        # Resize logo
        logo_size = int(img_size / 4)
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Calculate position
        pos = ((img.size[0] - logo_size) // 2, (img.size[1] - logo_size) // 2)
        
        # Add white border around logo
        border_size = 10
        draw.rectangle([pos[0]-border_size, pos[1]-border_size, pos[0]+logo_size+border_size, pos[1]+logo_size+border_size], fill=(255, 240, 245))
        
        img.paste(logo, pos)
    except Exception as e:
        print("Could not embed logo:", e)

    img.save(filename)
    print("Heart shaped QR code generated successfully!")

create_heart_qr('https://nadzirin26.github.io/coba-bikin-surat/', 'qr_code_love.png')
