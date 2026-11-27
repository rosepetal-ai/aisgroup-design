// Editable copy and workpieces for this job. Scene dimensions and read timing are illustrative.
export default {
  title: ["Carton code", "inspection"],
  sceneDescription: "A guarded conveyor and overhead reader track cartons A and B.",
  transport: "indexing",
  product: { name: "Carton", construction: "taped-carton" },
  items: [
    { id: "A", readable: true },
    { id: "B", readable: false },
  ],
  chapters: ["Overview", "Good read", "Failed read"],
  captions: [
    "Two cartons enter the same reader.",
    "The reader faces the printed code.",
    "The reader decodes carton A.",
    "Carton B moves under the same lens.",
    "A gap interrupts the code on carton B.",
    "The failed read stays with carton B.",
  ],
};
