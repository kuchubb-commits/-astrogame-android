import fitz
import sys
import os

PDF_PATH = r"C:\Users\PC-DELL\.claude\projects\astrogame-android\ASTROPRISMA files\Livres_PDF\ASTROPRISMA_CORE_BOOK_-_Single_Pages__PDF_2.0_.pdf"
OUTPUT_DIR = r"C:\Users\PC-DELL\.claude\projects\astrogame-android\pdf_pages"

def extract_page(page_number: int, dpi: int = 200):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    doc = fitz.open(PDF_PATH)
    page = doc[page_number - 1]  # 0-indexed
    mat = fitz.Matrix(dpi / 72, dpi / 72)
    pix = page.get_pixmap(matrix=mat)
    output_path = os.path.join(OUTPUT_DIR, f"page_{page_number:03d}.png")
    pix.save(output_path)
    doc.close()
    print(f"Page {page_number} -> {output_path}")
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python pdf_to_image.py <page_number> [dpi]")
        sys.exit(1)
    page_num = int(sys.argv[1])
    dpi = int(sys.argv[2]) if len(sys.argv) > 2 else 200
    extract_page(page_num, dpi)
