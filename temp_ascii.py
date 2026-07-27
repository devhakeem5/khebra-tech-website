from PIL import Image
try:
    img = Image.open('assets/images/logo.png').convert('L').resize((80, 40))
    chars = ' .:-=+*#%@'
    pixels = list(img.getdata())
    for i in range(40):
        row = pixels[i*80:(i+1)*80]
        print(''.join(chars[p//32] for p in row))
except Exception as e:
    print(e)
