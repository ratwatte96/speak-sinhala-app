import Image from "next/image";

const ProfileCard = () => {
  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <div className="p-6 rounded-lg  w-80 text-center">
        <Image
          src="/avatar.webp"
          alt="User Avatar"
          width={80}
          height={80}
          className="rounded-full mx-auto"
        />
        <h2 className="text-lg font-bold mt-4">Itunuoluwa Abidoye</h2>
        <p className="text-gray-500 text-sm">Itunuoluwa@petra.africa</p>

        <div className="flex justify-between mt-4">
          <div className="bg-gray-200 p-2 rounded-md w-1/2 mx-1 text-center">
            <p className="text-sm">Reading Completion</p>
            <p className="text-lg font-bold">100%</p>
          </div>
          <div className="bg-gray-200 p-2 rounded-md w-1/2 mx-1 text-center">
            <p className="text-sm">Speaking Completion</p>
            <p className="text-lg font-bold">5%</p>
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <button className="bg-blue-500 text-white w-1/2 py-2 rounded-md">
            Invite Friends
          </button>
          <button className="bg-yellow-400 text-black w-1/2 py-2 rounded-md">
            Get Premium
          </button>
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Change Password"
            className="w-full p-2 border rounded-md text-center"
          />
        </div>

        <button className="bg-green-500 text-white w-full py-2 mt-4 rounded-md">
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
