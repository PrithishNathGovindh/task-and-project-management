export function formatDate(dateValue) {
  if (!dateValue) {
    return 'No deadline'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue))
}

export function formatEnum(value) {
  if (!value) {
    return ''
  }

  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) {
    return 'Good Morning'
  }

  if (hour < 17) {
    return 'Good Afternoon'
  }

  return 'Good Evening'
}
