const db = require('../config/db');
const moment = require('moment');
const CreateHoliday = (req, res) => {
  const { name, days, startDate, endDate, createdBy, companyId } = req.body;

  // Input validation
  if (!name || !days || !startDate || !endDate || !companyId || !createdBy) {
    return res.status(400).json({
      status: 400,
      message: 'All fields (name, days, startDate, endDate, companyId, createdBy) are required',
    });
  }

  // Validate date formats
  const isValidDate = (dateStr) => {
    return moment(dateStr, 'YYYY-MM-DD', true).isValid();
  };

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid date format. Use YYYY-MM-DD',
    });
  }

  // Ensure startDate is not after endDate
  if (moment(startDate).isAfter(endDate)) {
    return res.status(400).json({
      status: 400,
      message: 'Start date cannot be after end date',
    });
  }

  const insertSql = `
    INSERT INTO HOLIDAYS (NAME, DAYS, START_DATE, END_DATE, COMPANY_ID, CREATED_BY, CREATION_DATE)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(insertSql, [name, days, startDate, endDate, companyId, createdBy], (error, result) => {
    if (error) {
      console.error('Error occurred:', error);
      return res.status(500).json({
        status: 500,
        message: 'Failed to create holiday',
        error: error.message,
      });
    }

    console.log('Result:', result);
    return res.status(201).json({
      status: 201,
      message: `Holiday ${name} created successfully`,
      data: {
        id: result.insertId,
        name,
        days,
        startDate,
        endDate,
        companyId,
        createdBy,
      },
    });
  });
};

module.exports = { CreateHoliday };