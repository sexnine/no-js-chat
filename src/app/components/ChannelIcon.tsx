const ChannelIcon = (props: IntrinsicElements["svg"]) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      aria-hidden={true}
      {...props}
    >
      <path
        fill="currentColor"
        d="M224 84h-43.8l7.61-41.85a12 12 0 0 0-23.62-4.3L155.8 84h-39.6l7.61-41.85a12 12 0 1 0-23.62-4.3L91.8 84H48a12 12 0 0 0 0 24h39.44l-7.27 40H32a12 12 0 0 0 0 24h43.8l-7.61 41.85a12 12 0 0 0 9.66 14A11.43 11.43 0 0 0 80 228a12 12 0 0 0 11.8-9.86l8.4-46.14h39.6l-7.61 41.85a12 12 0 0 0 9.66 14a11.43 11.43 0 0 0 2.16.2a12 12 0 0 0 11.8-9.86L164.2 172H208a12 12 0 0 0 0-24h-39.44l7.27-40H224a12 12 0 0 0 0-24Zm-79.83 64h-39.61l7.27-40h39.61Z"
      />
    </svg>
  );
};

export default ChannelIcon;
