import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export class ExportExcel {
    public static export(data: any, filename: String): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Datos': worksheet },
      SheetNames: ['Datos']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    saveAs(blob, `${filename}_${new Date().getTime()}.xlsx`);
    }
}