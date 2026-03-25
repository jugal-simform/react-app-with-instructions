import { useState, type ChangeEvent } from 'react'
import './App.css'

// Form data type definition
interface FormData {
  name: string
  address: string
  phone: string
}

// Validation errors type definition
interface ValidationErrors {
  name?: string
  address?: string
  phone?: string
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    phone: ''
  })
  
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submitted, setSubmitted] = useState(false)

  // Validation functions following secure-by-default practices
  
  /**
   * Validates name field: only alphabetic characters and spaces
   * Enforces length constraints (2-50 characters)
   */
  const validateName = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Name is required'
    }
    if (value.length < 2 || value.length > 50) {
      return 'Name must be between 2 and 50 characters'
    }
    // Allowlist: only letters and spaces
    const nameRegex = /^[A-Za-z\s]+$/
    if (!nameRegex.test(value)) {
      return 'Name can only contain letters and spaces'
    }
    return undefined
  }

  /**
   * Validates address field: alphanumeric, spaces, commas, hyphens
   * Enforces length constraints (5-200 characters)
   */
  const validateAddress = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Address is required'
    }
    if (value.length < 5 || value.length > 200) {
      return 'Address must be between 5 and 200 characters'
    }
    // Allowlist: alphanumeric, spaces, commas, hyphens, periods
    const addressRegex = /^[A-Za-z0-9\s,.-]+$/
    if (!addressRegex.test(value)) {
      return 'Address contains invalid characters'
    }
    return undefined
  }

  /**
   * Validates Indian phone number: exactly 10 digits starting with 6, 7, 8, or 9.
   * The +91 country code is a fixed, non-editable prefix in the UI.
   */
  const validatePhone = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Phone number is required'
    }
    // Allowlist: exactly 10 digits starting with 6–9 (Indian mobile numbers)
    const indianPhoneRegex = /^[6-9]\d{9}$/
    if (!indianPhoneRegex.test(value)) {
      return 'Phone number must be a valid Indian Phone Number'
    }
    return undefined
  }

  // Handle input changes with real-time validation
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Enforce maximum length at input level (defense in depth)
    const maxLengths: Record<string, number> = {
      name: 50,
      address: 200,
      phone: 10 // Indian mobile numbers are exactly 10 digits
    }
    
    if (value.length > maxLengths[name]) {
      return // Reject input exceeding max length
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: ValidationErrors = {
      name: validateName(formData.name),
      address: validateAddress(formData.address),
      phone: validatePhone(formData.phone)
    }
    
    setErrors(newErrors)
    
    // Check if there are any validation errors
    const hasErrors = Object.values(newErrors).some(error => error !== undefined)
    
    if (!hasErrors) {
      // Form is valid - process submission
      console.log('Form submitted successfully:', {
        ...formData,
        phone: `+91${formData.phone}`
      })
      setSubmitted(true)
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({ name: '', address: '', phone: '' })
        setSubmitted(false)
      }, 3000)
    }
  }

  return (
    <div className="app-container">
      <h1>Contact Information Form</h1>
      
      {submitted && (
        <div className="success-message" style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: '#d4edda', 
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '4px'
        }}>
          Form submitted successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <span id="name-error" className="error-message">{errors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? 'error' : ''}
            rows={3}
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? 'address-error' : undefined}
          />
          {errors.address && (
            <span id="address-error" className="error-message">{errors.address}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <div className={`phone-input-wrapper${errors.phone ? ' error' : ''}`}>
            {/* Non-editable +91 country code prefix for Indian phone numbers */}
            <span className="phone-prefix">+91</span>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="phone-input"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              placeholder="9XXXXXXXXX"
              maxLength={10}
              aria-label="Phone number (10 digits, country code +91 is pre-filled)"
            />
          </div>
          {errors.phone && (
            <span id="phone-error" className="error-message">{errors.phone}</span>
          )}
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  )
}

export default App
