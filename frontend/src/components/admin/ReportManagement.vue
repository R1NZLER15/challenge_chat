<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const reports = ref([])

onMounted(async () => {
  await getReports()
})

async function getReports() {
  const retrievedReports = await axios.get('http://localhost:3000/api/reports')
  reports.value = retrievedReports.data
}

function getReportTime(timestamp) {
  const units = [
    { label: 'year', value: 12 * 30 * 24 * 60 * 60 },
    { label: 'month', value: 30 * 24 * 60 * 60 },
    { label: 'day', value: 24 * 60 * 60 },
    { label: 'hour', value: 60 * 60 },
    { label: 'minute', value: 60 },
    { label: 'second', value: 1 }
  ]

  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now - time) / 1000)

  for (const unit of units) {
    const value = Math.floor(diffInSeconds / unit.value)
    if (value > 0) {
      return `The report was issued ${value} ${unit.label}${value > 1 ? 's' : ''} ago`
    }
  }

  return 'The report was just issued'
}

function reportStatus(status, type) {
  const colors = {
    approved: 'green',
    rejected: 'red',
    pending: 'orange'
  }

  const icons = {
    approved: 'fas fa-check',
    rejected: 'fas fa-times',
    pending: 'fas fa-clock'
  }

  return type === 'color' ? colors[status] : icons[status]
}

async function resolveReport(reportId, isApproved) {
  let status = isApproved ? 'approved' : 'rejected'
  try {
    await axios.put(`http://localhost:3000/api/reports/update/${reportId}`, { status: status })
    getReports()
  } catch (error) {
    console.error(error)
  }
}

async function deleteReport(reportId) {
  try {
    await axios.delete(`http://localhost:3000/api/reports/delete/${reportId}`)
    getReports()
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <v-card>
    <v-card-title>Reports</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item v-for="report in reports" :key="report.id">
          <template v-slot:title>
            <v-chip label color="red" text-color="white" small class="ma-1">
              <v-icon start color="red" icon="fas fa-user" />
              Report by: {{ report.reportedBy.username }}
            </v-chip>
            <v-chip label small :color="reportStatus(report.status, 'color')">
              <v-icon
                start
                :color="reportStatus(report.status, 'color')"
                :icon="reportStatus(report.status, 'icon')"
              />
              Status: {{ report.status }}
            </v-chip>
            <v-chip label small color="grey" text-color="white" class="ma-1">
              <v-icon start color="grey" icon="fas fa-clock" />
              {{ getReportTime(report.timestamp) }}
            </v-chip>
          </template>
          <v-alert dense outlined type="error" color="red-lighten-2">
            Current message: {{ report.message.text }}<br />
            Reported message: {{ report.originalMessage }}
          </v-alert>
          <template v-slot:append>
            <v-btn color="green" @click="resolveReport(report._id, true)" variant="plain">
              <v-icon icon="fas fa-check" />
            </v-btn>
            <v-btn color="red" @click="resolveReport(report._id, false)" variant="plain">
              <v-icon icon="fas fa-times" />
            </v-btn>
            <v-btn color="red" @click="deleteReport(report._id)" variant="plain">
              <v-icon icon="fas fa-trash" />
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
