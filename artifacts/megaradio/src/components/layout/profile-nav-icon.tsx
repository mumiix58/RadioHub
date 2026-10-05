type ProfileNavIconName = 'favorites' | 'discover' | 'profile' | 'messages' | 'feedback' | 'logout';

export function ProfileNavIcon({ name }: { name: ProfileNavIconName }) {
  const asset = `url("${import.meta.env.BASE_URL}icons/profile/${name}.svg")`;

  return (
    <span
      aria-hidden="true"
      className="mr-4 inline-block h-6 w-6 shrink-0 bg-current text-white group-aria-[current=page]:text-[#FF4199]"
      style={{ maskImage: asset, WebkitMaskImage: asset, maskRepeat: 'no-repeat', maskPosition: 'center' }}
    />
  );
}
