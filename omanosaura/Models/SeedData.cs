using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Omanosaura.Data;
using System;
using System.Linq;

namespace omanosaura.Models;

public static class SeedData
{
  public static void Initialize(IServiceProvider serviceProvider)
  {
    using (var context = new OmanosauraContext(
        serviceProvider.GetRequiredService<
            DbContextOptions<OmanosauraContext>>()))
    {
      // Look for any movies.
      if (context.Trip.Any())
      {
        return;   // DB has been seeded
      }
      context.Trip.AddRange(
          new Trip
          {
            Kind = TripKind.Adventure,
            TitleEn = "Adventure Trip",
            TitleAr = "رحلة مغامرة",
            LocationEn = "Salalah",
            LocationAr = "صلالة",
            Location = "Salalah",
            AboutEn = "Adventure trip to Salalah",
            AboutAr = "رحلة مغامرة إلى صلالة",
            Itinerary = "Day 1: Arrive in Salalah. Day 2: Explore Salalah. Day 3: Return home.",
            PriceBaisa = 500,
          },
          new Trip
          {
            Kind = TripKind.School,
            TitleEn = "School Trip",
            TitleAr = "رحلة مدرسية",
            LocationEn = "Muscat",
            LocationAr = "مسقط",
            Location = "Muscat",
            AboutEn = "School trip to Muscat",
            AboutAr = "رحلة مدرسية إلى مسقط",
            Itinerary = "Day 1: Arrive in Muscat. Day 2: Explore Muscat. Day 3: Return home.",
            PriceBaisa = 10000
          }
      );
      context.SaveChanges();
    }
  }
}
