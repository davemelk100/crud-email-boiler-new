<template>
  <div class="reports">
    <h1>Reports</h1>
    <p class="subtitle">Sample reports data with responsive table layout.</p>

    <table class="desktop-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Status</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.name">
          <td>{{ row.name }}</td>
          <td>{{ row.date }}</td>
          <td>{{ row.status }}</td>
          <td>{{ row.amount }}</td>
        </tr>
      </tbody>
    </table>

    <div class="mobile-cards">
      <dl v-for="row in rows" :key="row.name" class="card">
        <dt>Name</dt>
        <dd>{{ row.name }}</dd>
        <dt>Date</dt>
        <dd>{{ row.date }}</dd>
        <dt>Status</dt>
        <dd>{{ row.status }}</dd>
        <dt>Amount</dt>
        <dd>{{ row.amount }}</dd>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
const rows = [
  { name: "Alice Johnson", date: "2026-01-15", status: "Completed", amount: "$1,200.00" },
  { name: "Bob Smith", date: "2026-01-22", status: "Pending", amount: "$850.50" },
  { name: "Carol Davis", date: "2026-02-03", status: "Completed", amount: "$2,340.00" },
  { name: "Dan Wilson", date: "2026-02-10", status: "Failed", amount: "$475.25" },
  { name: "Eve Martinez", date: "2026-02-18", status: "Pending", amount: "$1,680.75" },
];
</script>

<style scoped>
.reports {
  line-height: 1.7;
}
.subtitle {
  font-size: 1.1rem;
  color: #555;
  margin: 0.5rem 0 2rem;
}

/* Desktop table */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.5rem 0;
}
th, td {
  text-align: left;
  padding: 0.4rem 0.75rem;
  border: 1px solid #e0e0e0;
}
th {
  background: #f5f5f5;
  font-weight: 600;
}

/* Mobile cards — hidden by default */
.mobile-cards {
  display: none;
}

@media (max-width: 640px) {
  .desktop-table {
    display: none;
  }
  .mobile-cards {
    display: block;
  }
  .card {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    margin-bottom: 0.75rem;
    background: #f5f5f5;
  }
  .card dt {
    font-weight: 600;
    font-size: 0.85rem;
    color: #555;
    margin-top: 0.5rem;
  }
  .card dt:first-child {
    margin-top: 0;
  }
  .card dd {
    margin: 0 0 0.25rem;
  }
}
</style>
