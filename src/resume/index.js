export const getSelectedShop = state => state.shops.find(shop => shop.selected)

export const getSelectedService = state =>
  state.services.find(service => service.selected)

export const getSelectedForm = state =>
  state.form.contact ? state.form.contact.values : {}

export const getFormErrors = state =>
  state.form.contact ? state.form.contact.syncErrors : undefined

export const getSuccessReservation = state => state.reservation.success

export const getSelectedGender = state =>
  state.genders.find(gender => gender.selected)

export const getSelectedPreparations = state =>
  state.prestations
    .filter(
      prestation =>
        prestation.preparations.filter(preparation => preparation.selected)
          .length > 0
    )
    .map(prestation => ({
      ...prestation,
      preparations: prestation.preparations.filter(
        preparation => preparation.selected
      )
    }))

export const getSelectedTimeSlot = state => {
  let result = false
  state.timeSlots.find(day =>
    day.timeSlots.find(timeSlot => {
      if (timeSlot.selected) {
        result = timeSlot
      }
      return timeSlot.selected
    })
  )
  return result
}

export const getReservationData = state => {
  let result = {}

  const selectedService = getSelectedService(state)
  if (!selectedService) {
    return result
    // if no service is selected > return {}
  }
  if (selectedService.id === 1) {
    return {
      shop: getSelectedShop(state),
      service: getSelectedService(state),
      gender: getSelectedGender(state),
      preparations: getSelectedPreparations(state),
      timeSlot: getSelectedTimeSlot(state)
    }
  }
  if (selectedService.id === 2) {
    return {
      shop: getSelectedShop(state),
      service: getSelectedService(state),
      countTable: getCountTable(state),
      timeSlot: getSelectedTimeSlot(state)
    }
  }
  if (selectedService.id === 3) {
    return {
      shop: getSelectedShop(state),
      service: getSelectedService(state),
      countGender: getCountGender(state),
      countPreparation: getCountPreparation(state),
      timeSlot: getSelectedTimeSlot(state)
    }
  }
}

export const getCountTable = state => state.countPeopleTable.count

export const getCountGender = state => state.genders

export const getCountPreparation = state => state.prestations

export const getCountByPrestation = (prestationId, prevState) =>
  prevState
    .find(prestation => prestationId === prestation.id)
    .preparations.reduce((acc, preparation) => acc + preparation.count, 0)

export const getCountByGender = (state, sex) =>
  state.genders.find(gender => gender.sex === sex).count
