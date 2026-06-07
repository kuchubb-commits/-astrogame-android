import fitz
import os
import sys

PDF_PATH = r"C:\Users\PC-DELL\.claude\projects\astrogame-android\ASTROPRISMA files\Livres_PDF\ASTROPRISMA_CORE_BOOK_-_Single_Pages__PDF_2.0_.pdf"
OUTPUT_DIR = r"C:\Users\PC-DELL\.claude\projects\astrogame-android\Astroprisma Core Book PNG"
DPI = 150

def convert_all():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    doc = fitz.open(PDF_PATH)
    total = doc.page_count
    mat = fitz.Matrix(DPI / 72, DPI / 72)

    print(f"PDF ouvert : {total} pages detectees")
    print(f"Dossier de sortie : {OUTPUT_DIR}")
    print(f"Resolution : {DPI} DPI")
    print("-" * 50)

    for i in range(total):
        page_num = i + 1
        page = doc[i]
        pix = page.get_pixmap(matrix=mat)
        filename = f"page_{page_num:03d}.png"
        output_path = os.path.join(OUTPUT_DIR, filename)
        pix.save(output_path)
        percent = int((page_num / total) * 100)
        bar = "#" * (percent // 5) + "-" * (20 - percent // 5)
        print(f"\r[{bar}] {percent}% — page {page_num}/{total}", end="", flush=True)

    doc.close()
    print(f"\n\nTermine ! {total} images sauvegardees dans :")
    print(OUTPUT_DIR)

if __name__ == "__main__":
    convert_all()
