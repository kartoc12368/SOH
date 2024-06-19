import React, { useState } from "react";
import { FaCircleCheck, MdCancel, MdTimer } from "react-icons/fa";

const TableComponent = ({ styles, data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={styles.tableMain}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Donation Id</th>
            <th>Donation Date</th>
            <th>Donor Details</th>
            <th>Amount</th>
            <th>Donor PAN</th>
            <th>Donor Address</th>
            <th>Payment Type</th>
            <th>Payment Status</th>
            <th>Donor City</th>
            <th>Donor State</th>
            <th>Donor Country</th>
            <th>Donor Pincode</th>
            <th>Donor Bank</th>
            <th>Donor Bank-branch</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.donation_id_frontend}>
              <td>{item.donation_id_frontend}</td>
              <td>{formatDate(item.donation_date)}</td>
              <td>
                {item.donor_first_name}
                <br />
                {item.donor_email}
                <br />
                {item.donor_phone}
              </td>
              <td>{renderField(item.amount)}</td>
              <td>{renderField(item.pan)}</td>
              <td>{renderField(item.donor_address)}</td>
              <td>{item.payment_type ? item.payment_type : "--"}</td>
              <td>
                {item.payment_status ? (
                  item.payment_status === "success" ? (
                    <FaCircleCheck color="#0FA900" />
                  ) : item.payment_status === "failed" ? (
                    <MdCancel color="red" />
                  ) : (
                    <MdTimer />
                  )
                ) : (
                  "--"
                )}
              </td>
              <td>{renderField(item.donor_city)}</td>
              <td>{renderField(item.donor_state)}</td>
              <td>{renderField(item.donor_country)}</td>
              <td>{renderField(item.donor_pincode)}</td>
              <td>{renderField(item.donor_bank_name)}</td>
              <td>{renderField(item.donor_bank_branch)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handleClick(index + 1)}
            disabled={index + 1 === currentPage}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TableComponent;
