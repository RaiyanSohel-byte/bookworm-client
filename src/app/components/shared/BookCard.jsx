import Image from "next/image";

export default function BookCard({ book }) {
  return (
    <div className="card relative group">
      <Image
        height={48}
        width={48}
        src={book.cover}
        className="h-48 w-full object-cover rounded"
        alt="Book Card"
      />
      <h3 className="font-semibold mt-2">{book.title}</h3>
      <p className="text-sm italic">{book.author}</p>

      {book.reason && (
        <div className="absolute bottom-2 left-2 right-2 bg-white text-xs p-2 rounded shadow opacity-0 group-hover:opacity-100">
          {book.reason}
        </div>
      )}
    </div>
  );
}
