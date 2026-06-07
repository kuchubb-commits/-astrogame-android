import fitz
import sys
import os

PDF_PATH = r"C:\Users\PC-DELL\.claude\projects\astrogame-android\ASTROPRISMA files\Livres_PDF\ASTROPRISMA_CORE_BOOK_-_Single_Pages__PDF_2.0_.pdf"
OUTPUT_DIR = r"C:\Users\PC-DELL\.claude\projects\astrogame-android\Astroprisma Core Book PNG"

# Numérotation projet : page 1 = The World (page PDF 4), offset = +3
# Pages avant The World : "0.1", "0.2", "0.3" (front matter, PDF pages 1-3)

def project_to_pdf_page(project_page: str) -> int:
    """Convertit une page projet en index PDF. Ex: '1' -> 4, '0.3' -> 3"""
    if str(project_page).startswith("0."):
        return int(str(project_page).split(".")[1])
    return int(project_page) + 3

def project_page_filename(project_page: str) -> str:
    """Retourne le nom de fichier pour une page projet."""
    p = str(project_page)
    if p.startswith("0."):
        return f"page_{p}.png"
    return f"page_{int(p):03d}.png"

def extract_page(project_page: str, dpi: int = 200):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    pdf_page = project_to_pdf_page(project_page)
    doc = fitz.open(PDF_PATH)
    page = doc[pdf_page - 1]  # 0-indexed
    mat = fitz.Matrix(dpi / 72, dpi / 72)
    pix = page.get_pixmap(matrix=mat)
    filename = project_page_filename(project_page)
    output_path = os.path.join(OUTPUT_DIR, filename)
    pix.save(output_path)
    doc.close()
    print(f"Page projet {project_page} (PDF p.{pdf_page}) -> {output_path}")
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python pdf_to_image.py <page_projet> [dpi]")
        print("  Exemples: python pdf_to_image.py 1       (The World)")
        print("            python pdf_to_image.py 0.3     (Table of Contents)")
        sys.exit(1)
    project_page = sys.argv[1]
    dpi = int(sys.argv[2]) if len(sys.argv) > 2 else 200
    extract_page(project_page, dpi)
