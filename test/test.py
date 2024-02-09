
from pdfgrabber import PDFGrabber
from databasemaker import DatabaseMaker
school_id = "LAEC"
school_name = "East Los Angeles College"
major = "science"
nickname = "sc"
delay = 0.2
grabber = PDFGrabber(school_id, major, nickname, delay)
id_to_key = grabber.get_pdfs()
maker = DatabaseMaker(school_name, nickname, id_to_key)
maker.add_classes()
