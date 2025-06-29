import Link from 'next/link';

export default function Home() {
  return (
      <div
          className="relative flex size-full min-h-screen flex-col bg-white dark:bg-gray-900 overflow-x-hidden transition-colors"
          style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
      >
        <div className="flex h-full grow flex-col">
          <div className="px-4 md:px-8 lg:px-40 flex flex-1 justify-center py-5">
            <div className="flex flex-col max-w-[960px] flex-1">
              <div>
                <div className="sm:p-4">
                  <div
                      className="flex min-h-[480px] flex-col gap-6 sm:gap-8 bg-cover bg-center bg-no-repeat sm:rounded-xl items-center justify-center p-4"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("./background.jpg")`
                      }}
                  >
                    <div className="flex flex-col gap-2 text-center">
                      <h1 className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em] drop-shadow-lg">
                        Find Your Path to Wellness
                      </h1>
                      <h2 className="text-gray-100 text-sm sm:text-base font-normal leading-normal drop-shadow-md">
                        EcoTherapy Wellness Retreats offers nature-based healing experiences in accessible urban settings, focusing on mental and physical restoration through outdoor activities.
                      </h2>
                    </div>
                    <Link href="/locations">
                      <button className="min-w-[84px] max-w-[480px] flex items-center justify-center rounded-full h-10 sm:h-12 px-4 sm:px-5 bg-[#94e0b2] hover:bg-[#7dd19f] text-[#121714] text-sm sm:text-base font-bold leading-normal tracking-[0.015em] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                        <span className="truncate">Explore Locations</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-10 px-4 py-10 @container">
                <div className="flex flex-col gap-4">
                  <h1 className="text-gray-900 dark:text-white tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px] transition-colors">
                    Our Approach
                  </h1>
                  <p className="text-gray-700 dark:text-gray-300 text-base font-normal leading-normal max-w-[720px] transition-colors">
                    We combine the therapeutic benefits of nature with expert-led wellness practices to create transformative experiences.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-3 pb-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <div
                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                        style={{
                          backgroundImage: `url("./yoga.jpg")` // Sets the card's background image
                        }}
                    />
                    <div>
                      <p className="text-gray-900 dark:text-white text-base font-medium leading-normal transition-colors">Nature-Based Healing</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal transition-colors">
                        Immerse yourself in the calming and restorative power of natural environments.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pb-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <div
                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                        style={{
                          backgroundImage: `url("./woods.jpg")` // Sets the card's background image
                        }}
                    />
                    <div>
                      <p className="text-gray-900 dark:text-white text-base font-medium leading-normal transition-colors">Expert Guidance</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal transition-colors">
                        Our certified therapists and wellness coaches provide personalized support and guidance.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pb-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <div
                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                        style={{
                          backgroundImage: `url("./meditate.png")` // Sets the card's background image
                        }}
                    />
                    <div>
                      <p className="text-gray-900 dark:text-white text-base font-medium leading-normal transition-colors">Accessible Urban Retreats</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal transition-colors">
                        Experience the benefits of nature without leaving the city, with convenient locations and flexible scheduling.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}