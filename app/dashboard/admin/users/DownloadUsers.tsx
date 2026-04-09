import ExcelJS from "exceljs";
import { User } from "./actions";

export const downloadUsersExcel = async (users: User[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Users");

  worksheet.columns = [
    { header: "Row #", key: "rowNumber", width: 10 },
    { header: "Email", key: "email", width: 32 },
    { header: "Active", key: "active", width: 10 },
    { header: "Name", key: "name", width: 20 },
    { header: "Full Name", key: "fullname", width: 24 },
    { header: "Birthdate", key: "birthdate", width: 14 },
    { header: "Gender", key: "gender", width: 12 },
  ];

  users.forEach((user, index) => {
    worksheet.addRow({
      rowNumber: index + 1,
      email: user.email,
      active: user.active ? "Yes" : "No",
      name: user.name,
      fullname: user.fullname || "",
      birthdate: user.birthdate ? new Date(user.birthdate).toLocaleDateString() : "",
      gender: user.gender || "",
    });
  });

  worksheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Users.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
