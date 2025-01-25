'use client'

import { Car } from "@/payload-types"
import { useFormFields } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

const CarPriceLabel: React.FC = () => {
  const [car, setCar] = useState<Car>()
  const carID = useFormFields(([fields]) => fields?.car?.value)

  useEffect(() => {
    if (car?.id !== carID) {
      const fetchCar = async () => {
        try {
          const carResult: Car = await fetch(`/api/cars/${carID}?depth=0`).then((res) => res.json())

          if (carResult) setCar(carResult)
        } catch (err) {
          console.error(err)
        }
      }

      fetchCar()
    }
  }, [car, carID])

  if (carID && typeof car === 'undefined') return <p>Loading...</p>

  return (
    <p>
      {car?.title} Price {car?.price}
    </p>
  )
}

export default CarPriceLabel
