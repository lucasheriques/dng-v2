"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export function InvoiceModal() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>View Invoice</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-600 text-base leading-6 font-sans">
          <div className="flex justify-between items-start mb-8">
            <div className="text-4xl text-gray-800 font-bold">
              <img
                src="https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=Tech+Solutions+Inc.&rounded=true&size=16"
                alt="Tech Solutions Inc."
                className="w-24 h-24 object-cover"
              />
            </div>
            <div className="text-right">
              <div className="font-bold">Invoice #INV-2025-001</div>
              <div>Created: 2025-01-05</div>
              <div>Due: 2025-02-04</div>
            </div>
          </div>

          <div className="flex justify-between mb-8">
            <div>
              <div className="font-bold mb-1">Tech Solutions Inc.</div>
              <div>123 Business Avenue</div>
              <div>San Francisco, CA 94105</div>
              <div>info@techsolutions.com</div>
            </div>
            <div className="text-right">
              <div className="font-bold mb-1">Client Corporation</div>
              <div>456 Enterprise Road</div>
              <div>New York, NY 10001</div>
              <div>billing@clientcorp.com</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="font-bold bg-gray-100 p-2 mb-2">
              Payment Methods
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-bold">ACH</div>
                <div>Bank Name: First National Bank</div>
                <div>Account Number: ****4567</div>
                <div>Routing Number: 021000021</div>
              </div>
              <div>
                <div className="font-bold">Wire</div>
                <div>SWIFT Code: FNBRUS33</div>
                <div>IBAN: US98765432100001</div>
              </div>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 font-bold">Item</th>
                <th className="text-right p-2 font-bold">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">
                  Software Development Services - January 2025
                </td>
                <td className="text-right p-2">5000.00</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Cloud Infrastructure Setup</td>
                <td className="text-right p-2">2500.00</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Technical Consultation (20 hours)</td>
                <td className="text-right p-2">3000.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="p-2 font-bold text-right" colSpan={2}>
                  Total: 10500.00
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="text-center">
            <DialogClose>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
