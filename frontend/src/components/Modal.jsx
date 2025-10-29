import { X } from 'lucide-react'
import React from 'react'

function Modal({isOpen, onClose, children, title}) {

    if(!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center justify-center w-full h-full overflow-hidden bg-black/40 backdrop-blur-sm">
        <div className="relative p-4 w-full max-w-2xl max-h-[90vh]">
            <div className="relative bg-white rounded-xl shadow-2xl border-gray-100">
                <div className="flex item-center justify-between p-5 md:p-6 border-b border-gray-100 rounded-t-xl">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {title}
                    </h3>
                    <button
                    onClick={onClose} type="button" className="cursor-pointer text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 rounded-lg text-sm w-9 h-9 flex justify-center items-center transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                        <X className='w-4 h-4' size={15}/>
                    </button>
                </div>

                <div className="p-5 md:p-6 text-gray-700">
                    {children}
                </div>

            </div>
        </div>
    </div>
  )
}

export default Modal
