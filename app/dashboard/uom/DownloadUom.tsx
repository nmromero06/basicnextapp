import ExcelJS from 'exceljs';
import { Uom } from "./actions";

export const downloadUomExcel = async (uoms: Uom[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("UOM");
    worksheet.columns = [
        { header: "Row Number", key: "rowNumber", width: 12 },
        { header: "UOM Name", key: "uomName", width: 15 },
        { header: "Description", key: "description", width: 30 }
    ];
    uoms.forEach((uom, index) => {
        worksheet.addRow({
            rowNumber: index + 1,
            uomName: uom.name,
            description: uom.description || ""
        });
    });
    worksheet.getRow(1).font = { bold: true };
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "UOM.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};
