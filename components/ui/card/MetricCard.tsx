// interface MetricCardProp {
//   title: string;
//   value: string | number;
//   change: () => void;
// }
// export const MetricCard = ({ title, value, change }): MetricCardProp => (
//   <div className="bg-white p-4 rounded-lg shadow-sm">
//     <div className="space-y-2">
//       <p className="text-sm text-gray-500">{title}</p>
//       <p className="text-2xl font-bold">{value}</p>
//       <div
//         className={`flex items-center space-x-1 ${
//           change.startsWith("+") ? "text-green-600" : "text-red-600"
//         }`}
//       >
//         {change.startsWith("+") ? (
//           <svg
//             className="w-4 h-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M5 15l7-7 7 7"
//             />
//           </svg>
//         ) : (
//           <svg
//             className="w-4 h-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M19 9l-7 7-7-7"
//             />
//           </svg>
//         )}
//         <span className="text-sm">{change}</span>
//       </div>
//     </div>
//   </div>
// );
