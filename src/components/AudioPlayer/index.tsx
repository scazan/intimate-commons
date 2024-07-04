export const AudioPlayer = ({ src: string }) => {
  return (
    <div className="fixed bottom-0 right-0 w-full">
      <audio controls autoPlay loop className="w-96">
        <source src={string} />
      </audio>
    </div>
  );
};
