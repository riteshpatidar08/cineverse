// utils/generateSeats.js

function generateSeatLayout({
    rows,
    seatsPerRow,
    premiumRows = [],
    reclinerRows = [],
    normalPrice = 200,
    premiumPrice = 300,
    reclinerPrice = 450,
  }) {
    return rows.map((row) => {
      let seatCategory = "regular";
      let seatPrice = normalPrice;
  
      if (reclinerRows.includes(row)) {
        seatCategory = "recliner";
        seatPrice = reclinerPrice;
      } else if (premiumRows.includes(row)) {
        seatCategory = "premium";
        seatPrice = premiumPrice;
      }
  
      return {
        row,
        seatCategory,
        seatPrice,
        seats: Array.from(
          { length: seatsPerRow },
          (_, index) => String(index + 1)
        ),
      };
    });
  }
  
  function generateScreen({
    screenName,
    rows,
    seatsPerRow,
    premiumRows = [],
    reclinerRows = [],
    normalPrice = 200,
    premiumPrice = 300,
    reclinerPrice = 450,
  }) {
    const seatLayout = generateSeatLayout({
      rows,
      seatsPerRow,
      premiumRows,
      reclinerRows,
      normalPrice,
      premiumPrice,
      reclinerPrice,
    });
  
    const totalSeats = seatLayout.reduce(
      (total, row) => total + row.seats.length,
      0
    );
  
    return {
      screenName,
      totalSeats,
      seatLayout,
    };
  }
  
  module.exports = {
    generateScreen,
    generateSeatLayout,
  };
  