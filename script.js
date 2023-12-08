
document.addEventListener('DOMContentLoaded', function() {
    let transactions;
    fetch('verses.csv')
    .then(response => response.text())
    .then(csvText => {
      // Now you have your CSV file content as text
      // You can then proceed to parse the CSV text
      transactions = parseCSVData(csvText);
      renderTransactions(transactions);
      calculateAndDisplayTotals(transactions); // Call the function to calculate and display totals
    })
    .catch(error => console.error('Error fetching the CSV file:', error));

    // Parse the CSV data into a usable format (array of objects)
    function parseCSVData(csvData) {
        const lines = csvData.trim().split('\n');
        const headers = lines.shift().split(',');
      
        function parseCSVLine(line) {
          const values = [];
          let currentField = '';
          let insideQuotes = false;
      
          for (let i = 0; i < line.length; i++) {
              const char = line[i];
              if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
                  insideQuotes = !insideQuotes;
                  continue; // Skip adding the quote itself to the field
              }
              if (char === ',' && !insideQuotes) {
                  values.push(currentField.trim());
                  currentField = '';
              } else {
                  currentField += char;
              }
          }
      
          values.push(currentField.trim()); // Add last field
          return values;
      }
      
      
        return lines.map(line => {
          const data = parseCSVLine(line);
          return headers.reduce((obj, nextKey, index) => {
            obj[nextKey.trim()] = data[index];
            return obj;
          }, {});
        });
      }
      

    // Initial transactions list
    //let transactions = parseCSVData(csvData);

    // Function to render transactions to the DOM
    function renderTransactions(transactions) {
        const listElement = document.getElementById('transactions-list');
        listElement.innerHTML = ''; // Clear current transactions
      
        transactions.forEach(transaction => {
          // Create a table row element
          const row = document.createElement('tr');
      
          // ID
          row.innerHTML += `<td align="right" style="padding: 0px 2px; color: white; white-space: nowrap; font-size: 75%;">${transaction.ID}</td>`;
      
          // Date and Time
          row.innerHTML += `<td style="padding: 0px 15px; opacity: 0.5; font-size: 75%; white-space: nowrap;">${transaction.Date}, ${transaction.Time}</td>`;
      
          // Description
          row.innerHTML += `<td align="left" style="padding: 0px 40px; white-space: nowrap;">${transaction.Description}</td>`;
      
          // Item
          row.innerHTML += `<td align="right" style="padding: 0px 5px; opacity: 0.5; font-size: 75%; white-space: nowrap;">${transaction.Item}</td>`;
      
          // Cost
          row.innerHTML += `<td align="left" style="color: green; opacity: 0.7; font-size: 75%; white-space: nowrap;">$${transaction.Cost}</td>`;
      
          // Status
          if (transaction.Status) {
            let statusColor = 'gray'; // Default color for 'Pending'
            if (transaction.Status === 'Accepted') statusColor = 'lightgreen';
            if (transaction.Status === 'Rejected') statusColor = 'lightcoral';
            row.innerHTML += `<td align="right" style="color: ${statusColor}; padding: 0px; opacity: 0.4; font-size: 75%; white-space: nowrap;">${transaction.Status}</td>`;
          }
      
          // Append the row to the table body
          listElement.appendChild(row);
        });
      }
      
    

    // Attach event listeners to sort buttons
    // Select buttons using their class name and add event listeners
    const sortButtons = document.querySelectorAll('.sort-button');
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
        // Retrieve the sorting method from data-sort-method attribute
        const sortMethod = this.getAttribute('data-sort-method');
        
        // Call the appropriate sorting function based on the sortMethod
        switch (sortMethod) {
            case 'amount':
            sortByValue();
            break;
            case 'date':
            sortByEarliest();
            break;
            case 'date-reverse':
            sortByLatest();
            break;
            case 'poet':
            sortByPoet();
            break;
            case 'equally':
            shuffleTransactions();
            break;
            // add any additional cases if necessary
        }
        });
    });

    // Sort transactions by value
    function sortByValue() {
      console.log("hello");
      transactions.sort((a, b) => parseFloat(b.Amount) - parseFloat(a.Amount));
      renderTransactions(transactions);
  }
  

    // Sort transactions by earliest date
    function sortByEarliest() {
        transactions.sort((a, b) => new Date(a.Date) - new Date(b.Date));
        renderTransactions(transactions);
    }

    // Sort transactions by latest date
    function sortByLatest() {
        transactions.sort((a, b) => new Date(b.Date) - new Date(a.Date));
        renderTransactions(transactions);
    }

    // Sort transactions by poet order
    function sortByPoet() {
        transactions.sort((a, b) => parseInt(a.Order) - parseInt(b.Order));
        renderTransactions(transactions);
    }

    // Shuffle transactions randomly
    function shuffleTransactions() {
        for (let i = transactions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [transactions[i], transactions[j]] = [transactions[j], transactions[i]];
        }
        renderTransactions(transactions);
    }

    function calculateAndDisplayTotals(transactions) {
        const constantAmount = 1254.59; // This is the constant amount of money you had.
        let totalValue = 0;
      
        transactions.forEach(transaction => {
          totalValue += parseFloat(transaction.Cost);
        });
      
        const percentageValue = (totalValue / constantAmount) * 100;
      
        // Update the HTML
        document.getElementById('total-value').textContent = '$' + totalValue.toFixed(2);
        document.getElementById('percentage-value').textContent = percentageValue.toFixed(2) + '%';
      }

});
