"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Animations

export default function CreatePlanPage() {
  const [step, setStep] = useState(0); // Estado para controlar el paso actual
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [tickets, setTickets] = useState([{ type: '', price: '', quantity: '', info: '' }]);
  const [image, setImage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('tickets', JSON.stringify(tickets));
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch(`/api/create/plan`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      alert('Plan created successfully');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const addTicket = () => {
    setTickets([...tickets, { type: '', price: '', quantity: '', info: '' }]);
  };

  const handleTicketChange = (index, field, value) => {
    const newTickets = tickets.map((ticket, i) =>
      i === index ? { ...ticket, [field]: value } : ticket
    );
    setTickets(newTickets);
  };

  const nextStep = () => {
    // Validar campos antes de avanzar
    if (step === 0 && !name) return alert("Por favor, completa el nombre.");
    if (step === 1 && !description) return alert("Por favor, añade una descripción.");
    if (step === 2 && !date) return alert("Por favor, selecciona una fecha.");
    if (step === 3 && tickets.some(ticket => !ticket.type || !ticket.price || !ticket.quantity)) {
      return alert("Por favor, completa todos los campos de tickets.");
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <main className="flex min-h-screen pl-[25em] pr-[25em] flex-col p-6">
      <Navbar />
      <div className="bg-white p-8 rounded-md w-full max-w-xl flex justify-center flex-col ml-[7em]">
        <h1 className="text-2xl font-bold mb-6 text-black">Crear un evento</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step1"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <h2 className="font-semibold text-black">Añade un nombre:</h2>
                <input
                  type="text"
                  value={name}
                  placeholder="Nombre General"
                  onChange={(e) => setName(e.target.value)}
                  className="border border-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200"
                  required
                />
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-black text-white py-2 px-4 rounded-md"
                >
                  Continuar
                </motion.button>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                key="step2"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <h2 className="font-semibold text-black">Añade una descripción:</h2>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción del Evento"
                  className="border border-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200"
                  required
                />
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-gray-300 py-2 px-4 rounded-md"
                >
                  Volver
                </motion.button>
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-black text-white py-2 px-4 rounded-md"
                >
                  Continuar
                </motion.button>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step3"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <h2 className="font-semibold text-black">Selecciona una fecha:</h2>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border border-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200"
                  required
                />
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-gray-300 py-2 px-4 rounded-md"
                >
                  Volver
                </motion.button>
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-black text-white py-2 px-4 rounded-md"
                >
                  Continuar
                </motion.button>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <h2 className="font-semibold text-black">Añade un banner o imagen:</h2>
                <img 
                  src={image ? URL.createObjectURL(image) : 'https://media.istockphoto.com/id/1324356458/vector/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=ZmXO4mSgNDPzDRX-F8OKCfmMqqHpqMV6jiNi00Ye7rE='} 
                  alt="Preview"
                  className="w-full h-auto max-w-[300px] max-h-[200px] mb-4 object-cover rounded-md"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="border border-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200"
                />
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-gray-300 py-2 px-4 rounded-md"
                >
                  Volver
                </motion.button>
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-black text-white py-2 px-4 rounded-md"
                >
                  Continuar
                </motion.button>
              </motion.div>
            )}
            {step === 4 && (
              <motion.div
                key="step5"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <h2 className="font-semibold text-black">Añade tus tickets:</h2>
                <AnimatePresence>
                  {tickets.map((ticket, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-4"
                    >
                      <input
                        type="text"
                        placeholder="Tipo de Ticket"
                        value={ticket.type}
                        onChange={(e) => handleTicketChange(index, 'type', e.target.value)}
                        className="border border-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Precio"
                        value={ticket.price}
                        onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                        className="border border-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Cantidad"
                        value={ticket.quantity}
                        onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                        className="border border-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200"
                        required
                      />
                      <textarea
                        placeholder="Información adicional"
                        value={ticket.info}
                        onChange={(e) => handleTicketChange(index, 'info', e.target.value)}
                        className="border border-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                <motion.button
                  type="button"
                  onClick={addTicket}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-gray-300 py-2 px-4 rounded-md"
                >
                  Añadir Otro Ticket
                </motion.button>
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-gray-300 py-2 px-4 rounded-md"
                >
                  Volver
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-black text-white py-2 px-4 rounded-md"
                >
                  Crear Evento
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </main>
  );
}
